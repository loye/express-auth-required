/**
 * Created by:   Lijian
 * Created on:   2016-11-02
 * Descriptions:
 */
'use strict';

const crypto = require('crypto');

class Encryptor {
  constructor({password, algorithm = 'aes192', encoding = 'base64'}) {
    if (!password) {
      throw new Error('password is missing!');
    }
    this.password = password;
    this.algorithm = algorithm;
    this.encoding = encoding;
  }

  encrypt(str) {
    if (!str) {
      return null;
    }
    try {
      let cipher = crypto.createCipher(this.algorithm, this.password);
      let buffer = cipher.update(str, 'utf8');
      return Buffer.concat([buffer, cipher.final()]).toString(this.encoding);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  decrypt(str) {
    if (!str) {
      return null;
    }
    try {
      let decipher = crypto.createDecipher(this.algorithm, this.password);
      let buffer = decipher.update(str, this.encoding);
      return Buffer.concat([buffer, decipher.final()]).toString('utf8');
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

}

module.exports = Encryptor;
