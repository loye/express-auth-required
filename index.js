/**
 * Created by:   Lijian
 * Created on:   2016-11-02
 * Descriptions:
 */
'use strict';

const Authentication = require('./authentication');
const Authorization = require('./authorization');

class Auth {
  /**
   *
   * @param authenticate function (req, res) return boolean|Promise
   * @param roleChecker function (req, res, role) return boolean|Promise
   * @param permissionChecker function (req, res, permission) return boolean|Promise
   */
  constructor({authenticate, roleChecker, permissionChecker}={}) {
    this._authentication = new Authentication({authenticate});
    this._authorization = new Authorization({roleChecker, permissionChecker});
  }

  anonymous(options = {}) {
    return this._authentication.anonymous(options);
  }

  requireLogin(options = {}) {
    if (typeof options === 'string') {
      options = {entry: options};
    }
    return this._authentication.requireLogin(options);
  }

  requireRole(options = {}) {
    if (typeof options === 'string') {
      options = {role: options};
    }
    return [this._authentication.requireLogin(options), this._authorization.requireRole(options)];
  }

  requireAnyRole(options = {}) {
    if (Array.isArray(options)) {
      options = {roles: options};
    }
    return [this._authentication.requireLogin(options), this._authorization.requireAnyRole(options)];
  }

  requirePermission(options = {}) {
    if (typeof options === 'string') {
      options = {permission: options};
    }
    return [this._authentication.requireLogin(options), this._authorization.requirePermission(options)];
  }

}

module.exports = Auth;
