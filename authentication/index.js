/**
 * Created by:   Lijian
 * Created on:   2016-11-01
 * Descriptions:
 */
'use strict';

class Authentication {
  /**
   *
   * @param authenticate function(req, res) return boolean|Promise
   */
  constructor({authenticate} = {}) {
    if (typeof authenticate !== 'function') {
      throw new Error('authenticate is not a function');
    }
    this._authenticate = authenticate;
  }

  anonymous() {
    let authenticate = this._authenticate;
    return function (req, res, next) {
      console.debug('anonymous', req.method, req.originalUrl);
      try {
        Promise.resolve(authenticate(req, res)).then(r => {
          next();
        }).catch(e=> {
          console.error('error on anonymous', e);
          defaultEntry(req, res, next);
        });
      }
      catch (e) {
        console.error('error on anonymous', e);
        defaultEntry(req, res, next);
      }
    }
  }

  /**
   *
   * @param options object{entry: string:loginUrl|function(req, res, next), except: string:path|object{path:string, method: string:(GET|POST|PUT|ALL|...)}}
   * @returns function(req, res, next)
   */
  requireLogin(options = {}) {
    let {entry = defaultEntry, except = []} = options;

    if (typeof options === 'string') {
      entry = loginUrlEntry(options);
    } else if (typeof entry === 'string') {
      entry = loginUrlEntry(entry);
    } else if (typeof entry !== 'function') {
      throw new Error('entry is not a function');
    }

    if (!Array.isArray(except)) {
      except = [except];
    }

    let authenticate = this._authenticate;
    return function (req, res, next) {
      try {
        console.debug('requireLogin', req.method, req.originalUrl);
        Promise.resolve(authenticate(req, res)).then(r => {
          let anonymous = isExcept(req, except);
          console.debug('requireLogin', req.method, req.originalUrl, 'authenticate', anonymous ? 'anonymous' : r);
          r || anonymous ? next() : entry.call(null, req, res, next);
        }).catch(e => {
          console.error('error on requireLogin', e);
          defaultEntry(req, res, next);
        });
      }
      catch (e) {
        console.error('error on requireLogin', e);
        defaultEntry(req, res, next)
      }
    }
  }
}

function defaultEntry(req, res, next) {
  //default entry
  let err = new Error('Forbidden');
  err.status = 403;
  next(err);
}

function loginUrlEntry(loginUrl) {
  return function (req, res, next) {
    res.redirect(loginUrl);
  };
}

function isExcept(req, except) {
  let path = req.path;
  let method = req.method;
  for (let i of except) {
    if (i) {
      let p = i, m;
      if (typeof i === 'string' || i instanceof RegExp) {
        p = i;
        m = 'ALL'
      } else if (typeof i.path === 'string' || i.path instanceof RegExp) {
        p = i.path;
        m = i.method || 'ALL';
      } else {
        break;
      }
      if (m === 'ALL' || m === method) {
        if (typeof p === 'string' && p.toLowerCase() === path.toLowerCase()) {
          return true;
        } else if (p instanceof RegExp && p.test(path)) {
          return true;
        }
      }
    }
  }
  return false;
}

module.exports = Authentication;
