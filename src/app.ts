import express = require('express');
import bodyParser from 'body-parser';
import morgan from 'morgan';
import Handlers from './handlers';

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initHandlers();
  }

  private initHandlers(): void {
    this.app.set('myIndent', 1);
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));

    this.app.use(Handlers.reqHandlerCallNextEmpty);
    this.app.use(Handlers.reqHandlerSendOkThenCallNext);
    this.app.use(Handlers.reqHandlerSendOk);
    this.app.use(Handlers.reqHandlerCallNextWithError);
    this.app.use(Handlers.errorHandlerA);
    this.app.use(Handlers.errorHandlerB);
    this.app.use(Handlers.reqHandlerSendOk);
    this.app.use(Handlers.reqHandlerThrowsError);

    // this.app.use(Handlers.reqHandlerCallNextEmpty);
    // this.app.use(Handlers.reqHandlerCallNextEmpty);
    // this.app.use(Handlers.reqHandlerCallNextEmpty);
    // this.app.use(Handlers.reqHandlerSendOk);
  }

  listen(): void {
    this.app.listen(3000, () => {
      console.log('  Listening at port 3000. http://localhost:3000');
    });
  }
}

(() => {
  const app = new App();
  app.listen();
})();

/*


Conclusions:

- When calling next...
  ... if the argument is empty, call the next error handler in the queue.
  ... if the argument is not empty, call the next error handler in the queue.

- When throwing error...
  ... call the next error handler.

- When entering a handler, it doesnt matter if the previous one sent an error (will continue later... TODO)


 */
