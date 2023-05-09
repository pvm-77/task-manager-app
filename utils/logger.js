import chalk from 'chalk';
const info=(params)=>{
    console.log(chalk.bgYellow.bold.black(params));
}

const error=(params)=>{
    console.error(chalk.bgGray.bold.red(params));
}

export default {info,error}