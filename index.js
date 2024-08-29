/* ========================================================================= */
// Библиотеки
const fs = require('fs');
const inquirer = require('inquirer');
const ethers = require('ethers')
/* ========================================================================= */
// Модули
const mint = require('./mint').mint;
const {logError, logInfo, hexLog, logWarn, evaluateProxy, logSuccess, pause,
  randomBetweenInt, consoleTime,
  MINUTE, SECOND,
  shuffle} = require('./helper');
const {getWallet, getBalance} = require('./ethers_helper');
const {createProvider} = require('./providers');
// console.log(mint);

/* ========================================================================= */
// Код
const mintArray = Object.keys(mint).map(element => element).reverse();
// console.log(mintArray);

/* ========================================================================= */
// Меню
const questions = [
  {
    name: "choice",
    type: "list",
    message: " ",
    choices: mintArray.map(function(key){
      return {
        name: (!mint[key].ended) ? mint[key].name : `${mint[key].name} [ENDED]`, 
        value: key}
    })
  }
];

/* ========================================================================= */
(
  async () => {
    // Выбор минта
    // const answers = await inquirer.prompt(questions);
    // let choice = await answers.choice;
    let choice = 0;
    // console.log("Выбрали для минта:", mint[choice].name, mint[choice], choice);
    logInfo(`Выбрали для минта: ${hexLog(mint[choice].name, 'balance')}`)

    if (mint[choice].ended || choice === "mintFunctions") {
      logError(`Выбрали неактивный минт.`);
      return false;
    }

    // Проверяем файл unready.txt
    const unreadyExist = fs.existsSync('./_CONFIGS/unready.txt');
    if (!unreadyExist) {
      logError(`Файл unready.txt не существует. Создаю`);
      fs.writeFileSync(`./_CONFIGS/unready.txt`, ``, `utf-8`);

      // Проверяем приватные адреса
      const privatesExist = fs.existsSync('privates.txt');
      if (!privatesExist) {
        logError(`Файл privates.txt не существует. Создаю`);
        fs.writeFileSync(`privates.txt`, ``, `utf-8`);
        return false;
      }

      // Считываем приватные адреса
      const privateKeys = fs.readFileSync(`privates.txt`, `utf-8`)
        .split("\n")
        .map(row => row.trim())
        .filter(pk => pk !== "");
      // console.log(privateKeys.length, privateKeys);
      if (privateKeys.length === 0) {
        logError(`Файл privates.txt пуст.`);
        return false;
      }

      // Проверяем прокси
      const proxyExist = fs.existsSync('proxy.txt');
      if (!proxyExist) {
        logError(`Файл proxy.txt не существует. Создаю`);
        fs.writeFileSync(`proxy.txt`, ``, `utf-8`);
        return false;
      }

      // Считываем прокси
      const proxyList = fs.readFileSync(`proxy.txt`, `utf-8`)
        .split("\n")
        .map(row => row.trim())
        .filter(proxy => proxy !== "");
      if (proxyList.length === 0) {
        logError(`Файл proxy.txt пуст.`);
        return false;
      }
      
      // Проверяем соответствие
      if (proxyList.length !== privateKeys.length) {
        logError(`Количество прокси не соответствует количеству приватных ключей`);
        logWarn(`Прокси: ${proxyList.length}. Приватных ключей: ${privateKeys.length}`)
        return false;
      }

      // Объединяем privateKeys и proxyList
      let unready = ``;
      for await (let [i, privateKey] of privateKeys.entries()) {
        unready += `id${i+1};${privateKey};${proxyList[i]}\n`;
      }
      fs.writeFileSync(`./_CONFIGS/unready.txt`, unready, `utf-8`);

      return false;
    }

    const configExist = fs.existsSync('./_CONFIGS/BASE.json');
    if (!configExist) {
      logError(`Конфиг BASE.json не существует. Копирую конфиг по умолчанию.`);
      logWarn(`Заполните BASE.json`);
      fs.copyFileSync('./_CONFIGS/BASE.json_', './_CONFIGS/BASE.json');
      return false;
    };

    const CONFIG = require('./_CONFIGS/BASE.json');
    // console.log(CONFIG);
    if (CONFIG.SHUFFLE_PK) {
      logWarn(`Включена рандомизация кошельков`);
    };

    // Стартуем
    // const privateKeysOld = JSON.parse(JSON.stringify(privateKeys));
    let unready = fs
      .readFileSync(`./_CONFIGS/unready.txt`, `utf-8`)
      .split("\n")
      .filter(row => row !== "");

    unready =  (CONFIG.SHUFFLE_PK) ? shuffle(unready) : unready;

    logWarn(`RPC: ${CONFIG.RPC}`);
    if (CONFIG.MAX_GWEI_ETHEREUM) logWarn(`Включено отслеживание gwei в Ethereum: ${CONFIG.MAX_GWEI_ETHEREUM}`);
    if (!CONFIG.MAX_ERRORS) {
      logError(`Не установлен параметр MAX_ERRORS в конфиге`);
    }

    logWarn(`Количество ошибок: ${CONFIG.MAX_ERRORS}`);
    logWarn(`Максимальный gwei: ${CONFIG.MAX_GWEI_PROJECT}`);
    logWarn(`Пауза между кошельками: от ${CONFIG.PAUSE_BETWEEN_ACCOUNTS[0]} до ${CONFIG.PAUSE_BETWEEN_ACCOUNTS[1]} секунд`);
    logWarn(`Тип прокси: ${CONFIG.PROXY_TYPE}`);
    logWarn(`RPC: ${CONFIG.RPC}`);
    console.log();

    if (unready.length === 0) {
      logError(`Файл unready.txt существует, но пуст.`);
      fs.unlinkSync(`./_CONFIGS/unready.txt`);
      return false;
    }

    let length = unready.length;
    fs.appendFileSync(`./_LOGS/logs.txt`, `${"*".repeat(100)}\n${consoleTime()}\n${mint[choice].name} | Кошельков: ${length}\n${"*".repeat(100)}\n`);

    
    let mints = [];

    if (choice === 0) {
      logError(`Выбрали все минты`);
      mints = Object.values(mint);
      // console.log(mints);
      mints = mints.filter(el => el.ended !== true && el.choice !== 0);
      // console.log(mints);
    } else {
      mints = Object.values(mint);
      // console.log(mints);
      mints = mints.filter(el => el.choice === choice)
    }

    for await (let [i, row] of unready.entries()) {
      // console.log(row);
      console.log();
      console.log();
      console.log();
      console.log();

      // Удаляем кошелек из файла неготовых
      unready = unready.filter(el => el !== row); 
      fs.writeFileSync(`./_CONFIGS/unready.txt`, unready.join("\n"), `utf-8`);


      let [id, privateKey, proxy] = row.split(";").map(el => el.trim());
      // console.log(id, privateKey, proxy);
      // continue;

      const BOT = {};
      await createBot(BOT, proxy, privateKey);
      // console.log(BOT);

      let balance = await getBalance(BOT, "BASE");
      balance = ethers.formatEther(balance);

      logInfo(`Баланс кошелька: ${balance}`);

      if (balance < CONFIG.MIN_BALANCE) {
        logWarn(`Слишком маленький баланс`)
        continue;
      };


      try {

        //Ждем газ и выставляем параметры транзакции (gasPrice)
        // BOT.tx_params["BASE"].maxFeePerGas = 0;
        // BOT.tx_params["BASE"].maxPriorityFeePerGas = 0;

        // Txn Type: 0 (Legacy) Rabby Wallet
        BOT.tx_params["BASE"].type = 0;


        // console.log("mints", mints, choice, typeof(choice))
        // mints = shuffle(mints);

        let maxMints = randomBetweenInt(CONFIG.MAX_MINTS[0], CONFIG.MAX_MINTS[1]);
        logInfo(`Делаем минтов: ${maxMints}`);

        let k = 0;
        for await (let currentMint of shuffle(mints)) {
          // console.log(currentMint);
          // continue;
          await pause(2 * SECOND);
          k++;
          // console.log(k, k > maxMints, maxMints)
          if ( k > maxMints) {
            // logWarn(`скип`)
            // console.log(k, k > maxMints, maxMints)
            continue;
          }
          let msg = ``;
          let standardMsg = `Кошелек [${BOT.wallets["BASE"].address} | ${id}] [${k} из ${maxMints}] | [${parseInt(i) + 1} из ${length}]`;
          standardMsg += ` | ${currentMint.name} `;

          choice = currentMint.choice;
          // Делаем минт
          let tx = await  mint.mintFunctions[choice](BOT, mint[choice]);

          if (tx === true) {
            logSuccess(standardMsg + `| Минт уже был совершен.`);
            // msg = consoleTime() + " | " + standardMsg + `| Минт уже был совершен.\n`;
          }
          else {

            if (tx === false) {
              logError(standardMsg + `| Не смогли заминтить`);
              msg = consoleTime() + " | " + standardMsg + `| Не смогли заминтить\n`
            } else {
              logWarn(standardMsg + `| ${tx.hash}`);
              // msg = consoleTime() + " | " + standardMsg + `| Транзакция в очереди | ${tx.hash}\n`;
              await tx.wait();
              logSuccess(standardMsg + `| ${tx.hash}`);
              msg = consoleTime() + " | " + standardMsg + `| Транзакция готова | ${CONFIG.EXPLORER}/tx/${tx.hash}\n`;
            }

          }

          // Записываем логи и обновляем файлы
          fs.appendFileSync(`./_LOGS/logs.txt`, msg, `utf-8`);
          // fs.appendFileSync(`./_CONFIGS/ready.txt`, row + "\n", `utf-8`);

          // Если минт был совершен ранее, то пропускаем паузу
          if (tx === true) continue;
          if (tx === false) continue;

          // Пауза между транзакциями
          let pauseSeconds = randomBetweenInt(
            CONFIG.PAUSE_SEC_BETWEEN_TXN[0],
            CONFIG.PAUSE_SEC_BETWEEN_TXN[1]
          );

          let pauseSecondsMs = pauseSeconds * SECOND;
          logInfo(standardMsg + ` | Пауза между транзами ${pauseSecondsMs / SECOND} секунд`);
          console.log(k, k > maxMints, maxMints);
          // Пауза между транзакциями
          await pause(pauseSecondsMs);
        }
       
        // Если последний кошелек, то ждать не нужно
        // console.log(i, i+1, i+1 === unready.length, unready.length);
        // if (i+1 === length) continue;

        // Пауза между кошельками
        let pauseSeconds = randomBetweenInt(
          CONFIG.PAUSE_BETWEEN_ACCOUNTS[0],
          CONFIG.PAUSE_BETWEEN_ACCOUNTS[1]
        );
        let pauseSecondsMs = pauseSeconds * SECOND;
        logInfo(` | Пауза ${pauseSecondsMs / SECOND} секунд между акками`);

        // Пауза между кошельками
        await pause(pauseSecondsMs);

        
      } catch (err) {
        // fs.appendFileSync(`./_LOGS/logs.txt`, msg, `utf-8`);
        // fs.appendFileSync(`./_CONFIGS/fail.txt`, row + "\n", `utf-8`);
        logError(err.message);
        console.error(err);
      }

    };



    // createBot
    async function createBot(BOT, proxy, privateKey) {
      BOT.configs = {"BASE": CONFIG};
      BOT.tx_params = {"BASE": {}};
      // Создаем провайдера
      BOT.providers = {};

      BOT.proxy = evaluateProxy(proxy, CONFIG.PROXY_TYPE);
      // console.log(BOT.proxy);
      // return;

      BOT.providers["BASE"] = await createProvider({
        RPC: CONFIG.RPC,
        proxy: BOT.proxy
      });

      // Создаем провайдера ETHEREUM
      if (CONFIG.MAX_GWEI_ETHEREUM) {
        BOT.providers["ETHEREUM"] = await createProvider({
          RPC: CONFIG.RPC_ETHEREUM,
          proxy: BOT.proxy
        });
      };

      // Создаем кошелек
      BOT.wallets = {};
      BOT.wallets["BASE"] = await getWallet(privateKey, BOT.providers["BASE"]);
      BOT.errors = {};
      BOT.errors["BASE"] = 0;

      return BOT;
    }

    process.exit(1);
  }
)();

