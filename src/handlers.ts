import { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';

const log: any = (target: any, methodName: any, descriptor: any): any => {
  const originalMethod = target[methodName];
  const newMethod = (...args: any[]) => {
    const req = args[1];
    let myIndent = req.app.get('myIndent');
    let indentedSpaces = '    '.repeat(myIndent);
    console.log(indentedSpaces + '==> 📞 ', methodName);
    req.app.set('myIndent', myIndent + 1);

    let originalResult = originalMethod.apply(this, args);

    req.app.set('myIndent', myIndent - 1);
    console.log(indentedSpaces + '<== 📞 ', methodName);

    return originalResult;
  };
  target[methodName] = newMethod;
};

export default class Handlers {
  // ---------------------------------------------------------- Request Handlers
  static logPre(req: any, methodName: any) {
    let myIndent = req.app.get('myIndent') + 1;

    req.app.set('myIndent', myIndent);

    console.log('    '.repeat(myIndent) + '==> 📞 ', methodName);
  }

  static logPost(req: any, methodName: any) {
    let myIndent = req.app.get('myIndent');

    console.log('    '.repeat(myIndent) + '<== 📞 ', methodName);

    req.app.set('myIndent', myIndent - 1);
  }

  static reqHandlerSendOk: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ): any => {
    Handlers.logPre(req, '🙏 reqHandlerSendOk');
    res.status(200).send('ok');
    Handlers.logPost(req, '🙏 reqHandlerSendOk');
  };

  static reqHandlerSendOkThenCallNext: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ): any => {
    Handlers.logPre(req, '🙏 reqHandlerSendOkThenCallNext');
    res.status(200).send('ok');
    next();
    Handlers.logPost(req, '🙏 reqHandlerSendOkThenCallNext');
  };

  static reqHandlerCallNextEmpty: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Handlers.logPre(req, '🙏 reqHandlerCallNextEmpty');
    next();
    Handlers.logPost(req, '🙏 reqHandlerCallNextEmpty');
  };

  static reqHandlerCallNextWithError: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Handlers.logPre(req, '🙏 reqHandlerCallNextWithError');
    next(new Error('💥 error generated at "reqHandlerCallNextWithError"'));
    Handlers.logPost(req, '🙏 reqHandlerCallNextWithError');
  };

  static reqHandlerThrowsError: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Handlers.logPre(req, '🙏 reqHandlerThrowsError');
    throw new Error('💥 🏌️ Thrown error');
    Handlers.logPost(req, '🙏 reqHandlerThrowsError');
  };

  // ---------------------------------------------------------- Error Handlers
  static errorHandlerA: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Handlers.logPre(req, '💥 errorHandlerA');
    let myIndent = req.app.get('myIndent');
    let indentedSpaces = '    '.repeat(myIndent);
    if (error) {
      console.log(indentedSpaces + 'Received error: ', error.message);
    } else {
      console.log(indentedSpaces + 'Did not received error');
    }
    next();
    Handlers.logPost(req, '💥 errorHandlerA');
  };

  static errorHandlerB: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Handlers.logPre(req, '💥 errorHandlerB');
    let myIndent = req.app.get('myIndent');
    let indentedSpaces = '    '.repeat(myIndent);
    if (error) {
      console.log(indentedSpaces + 'Received error: ', error.message);
    } else {
      console.log(indentedSpaces + 'Did not received error');
    }
    next();
    Handlers.logPost(req, '💥 errorHandlerB');
  };

  static errorHandlerC: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // let myIndent = req.app.get('myIndent');
    // let indentedSpaces = '    '.repeat(myIndent);
    // console.log(indentedSpaces + '==> 📞 💥 errorHandlerC');
    // req.app.set('myIndent', myIndent + 1);
    // does nothing
    // req.app.set('myIndent', myIndent - 1);
  };
}
