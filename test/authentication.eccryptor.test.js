/**
 * Created by:   Lijian
 * Created on:   2016-11-02
 * Descriptions:
 */
const assert = require('assert');

const Encryptor = require('../authentication/encryptor');

describe('encryptor', function () {
  describe('encrypt', function () {
    it('should be null when src is empty', function (done) {
      let encryptor = new Encryptor({password: 'test_pa$$w0rd'});
      let src = '';

      assert.equal(encryptor.encrypt(src), null);
      done();
    });

    it('should has length > 0 when src is valid', function (done) {
      let encryptor = new Encryptor({password: 'test_pa$$w0rd'});
      let src = 'abc';

      assert.ok(encryptor.encrypt(src).length > 0);
      done();
    });
  });

  describe('decrypt', function () {
    it('should be null when src is empty', function (done) {
      let encryptor = new Encryptor({password: 'test_pa$$w0rd'});
      let src = '';

      assert.equal(encryptor.decrypt(src), null);
      done();
    });

    it('should be equal to the raw string when decrypt', function (done) {
      let encryptor = new Encryptor({password: 'test_pa$$w0rd'});
      let src = 'abc';
      let encrypted = encryptor.encrypt(src);

      assert.equal(encryptor.decrypt(encrypted), src);
      done();
    });
  });

});
