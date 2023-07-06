const fs = require('fs');
const path = require('path');

const args = process.argv;

const currentWorkingDirectory = path.dirname(args[1]);

if (!fs.existsSync(path.join(currentWorkingDirectory, 'todo.txt'))) {
  fs.writeFileSync(path.join(currentWorkingDirectory, 'todo.txt'), '');
}

if (!fs.existsSync(path.join(currentWorkingDirectory, 'done.txt'))) {
  fs.writeFileSync(path.join(currentWorkingDirectory, 'done.txt'), '');
}

const InfoFunction = () => {
  const UsageText = `
Usage:
$ node app.js add "todo item" # Add a new todo
$ node app.js ls             # Show remaining todos
$ node app.js del NUMBER     # Delete a todo
$ node app.js done NUMBER    # Complete a todo
$ node app.js help           # Show usage
$ node app.js report         # Statistics`;

  console.log(UsageText);
};

const listFunction = () => {
  const fileData = fs.readFileSync(path.join(currentWorkingDirectory, 'todo.txt')).toString();
  const data = fileData.split('\n');
  const filterData = data.filter((value) => value !== '');

  if (filterData.length === 0) {
    console.log('There are no pending todos!');
  } else {
    for (let i = 0; i < filterData.length; i++) {
      console.log(`${filterData.length - i}. ${filterData[i]}`);
    }
  }
};

const addFunction = () => {
  const newTask = args[3];

  if (newTask) {
    const fileData = fs.readFileSync(path.join(currentWorkingDirectory, 'todo.txt')).toString();
    fs.writeFile(path.join(currentWorkingDirectory, 'todo.txt'), `${newTask}\n${fileData}`, (err) => {
      if (err) throw err;
      console.log(`Added todo: "${newTask}"`);
    });
  } else {
    console.log('Error: Missing todo string. Nothing added!');
  }
};

const deleteFunction = () => {
  const deleteIndex = args[3];

  if (deleteIndex) {
    const fileData = fs.readFileSync(path.join(currentWorkingDirectory, 'todo.txt')).toString();
    const data = fileData.split('\n');
    const filterData = data.filter((value) => value !== '');

    if (deleteIndex > filterData.length || deleteIndex <= 0) {
      console.log(`Error: todo #${deleteIndex} does not exist. Nothing deleted.`);
    } else {
      filterData.splice(filterData.length - deleteIndex, 1);
      const newData = filterData.join('\n');

      fs.writeFile(path.join(currentWorkingDirectory, 'todo.txt'), newData, (err) => {
        if (err) throw err;
        console.log(`Deleted todo #${deleteIndex}`);
      });
    }
  } else {
    console.log('Error: Missing NUMBER for deleting todo.');
  }
};

const doneFunction = () => {
  const doneIndex = args[3];

  if (doneIndex) {
    const dateObj = new Date();
    const dateString = dateObj.toISOString().substring(0, 10);

    const todoData = fs.readFileSync(path.join(currentWorkingDirectory, 'todo.txt')).toString();
    const doneData = fs.readFileSync(path.join(currentWorkingDirectory, 'done.txt')).toString();
    const data = todoData.split('\n');
    const filterData = data.filter((value) => value !== '');

    if (doneIndex > filterData.length || doneIndex <= 0) {
      console.log(`Error: todo #${doneIndex} does not exist.`);
    } else {
    
      const deleted = filterData.splice(filterData.length - doneIndex, 1);
      const newData = filterData.join('\n');

      fs.writeFile(path.join(currentWorkingDirectory, 'todo.txt'), newData, (err) => {
        if (err) throw err;
      });

      fs.writeFile(path.join(currentWorkingDirectory, 'done.txt'), `x ${dateString} ${deleted}\n${doneData}`, (err) => {
        if (err) throw err;
        console.log(`Marked todo #${doneIndex} as done.`);
      });
    }
  } else {
    console.log('Error: Missing NUMBER for marking todo as done.');
  }
};

const reportFunction = () => {
  const todoData = fs.readFileSync(path.join(currentWorkingDirectory, 'todo.txt')).toString();
  const doneData = fs.readFileSync(path.join(currentWorkingDirectory, 'done.txt')).toString();
  const filterTodoData = todoData.split('\n').filter((value) => value !== '');
  const filterDoneData = doneData.split('\n').filter((value) => value !== '');

  const dateString = new Date().toISOString().substring(0, 10);

  console.log(`${dateString} Pending : ${filterTodoData.length} Completed : ${filterDoneData.length}`);
};

switch (args[2]) {
  case 'add':
    addFunction();
    break;
  case 'ls':
    listFunction();
    break;
  case 'del':
    deleteFunction();
    break;
  case 'done':
    doneFunction();
    break;
  case 'help':
    InfoFunction();
    break;
  case 'report':
    reportFunction();
    break;
  default:
    InfoFunction();
    break;
}
