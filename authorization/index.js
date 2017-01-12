/**
 * Created by:   Lijian
 * Created on:   2016-11-02
 * Descriptions:
 */
'use strict';

class Authorization {
  /**
   *
   * @param roleChecker function (req, res, role) return boolean|Promise
   * @param permissionChecker function (req, res, permission) return boolean|Promise
   */
  constructor({roleChecker, permissionChecker} = {}) {
    this._roleChecker = roleChecker;
    this._permissionChecker = permissionChecker;
  }

  requireRole(options = {}) {
    if (typeof options === 'string') {
      options = {role: options};
    }
    let {role} = options;
    let roleChecker = this._roleChecker;
    if (typeof roleChecker !== 'function') {
      throw new Error('roleChecker is missing or is not a function');
    }
    return function (req, res, next) {
      console.debug('requireRole', role, req.method, req.originalUrl);
      try {
        Promise.resolve(roleChecker(req, res, role)).then(r => {
          r ? next() : forbidden(req, res, next);
        }).catch(e => {
          console.error('error on requireRole', e);
          forbidden(req, res, next);
        });
      }
      catch (e) {
        console.error('error on requireRole', e);
        forbidden(req, res, next);
      }
    }
  }

  requireAnyRole(options = {}) {
    if (Array.isArray(options)) {
      options = {roles: options};
    }
    let {roles} = options;
    let roleChecker = this._roleChecker;
    if (typeof roleChecker !== 'function') {
      throw new Error('roleChecker is missing or is not a function');
    }
    return function (req, res, next) {
      console.debug('requireAnyRole', roles, req.method, req.originalUrl);
      new Promise((resolve, reject) => {
        try {
          for (let role of roles) {
            Promise.resolve(roleChecker(req, res, role)).then(r => {
              r && resolve(r);
            }).catch(reject);
          }
        }
        catch (e) {
          reject(e);
        }
      }).then(r => {
          r ? next() : forbidden(req, res, next);
        }).catch(e => {
          console.error('error on requireAnyRole', e);
          forbidden(req, res, next);
        });
    }
  }

  requirePermission(options = {}) {
    if (typeof options === 'string') {
      options = {permission: options};
    }
    let {permission} = options;
    let permissionChecker = this._permissionChecker;
    if (typeof permissionChecker !== 'function') {
      throw new Error('permissionChecker is missing or is not a function');
    }
    return function (req, res, next) {
      console.debug('requirePermission', permission, req.method, req.originalUrl);
      try {
        Promise.resolve(permissionChecker(req, res, permission)).then(r => {
          r ? next() : forbidden(req, res, next);
        }).catch(e => {
          console.error('error on requirePermission', e);
          forbidden(req, res, next);
        });
      }
      catch (e) {
        console.error('error on requirePermission', e);
        forbidden(req, res, next);
      }
    }
  }

}

function forbidden(req, res, next) {
  //default entry
  let err = new Error('Forbidden');
  err.status = 403;
  next(err);
}

module.exports = Authorization;
