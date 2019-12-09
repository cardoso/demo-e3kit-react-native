import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';

import Device, {setLogger} from './Device.js';

export default class Demo extends Component {
  state = {
    logs: '',
  };

  alice = new Device('Alice2');
  bob = new Device('Bob2');

  bobLookup = null;
  aliceLookup = null;

  async componentDidMount() {
    setLogger(e => this.log(e));

    this.log('* Testing main methods:');

    this.log('\n----- EThree.initialize -----');
    await this.initializeUsers();
    this.log('\n----- EThree.register -----');
    await this.registerUsers();
    this.log('\n----- EThree.findUsers -----');
    await this.findUsers();
    this.log('\n----- EThree.encrypt & EThree.decrypt -----');
    await this.encryptAndDecrypt();

    this.log('\n* Testing private key backup methods:');

    this.log('\n----- EThree.backupPrivateKey -----');
    await this.backupPrivateKeys();
    this.log('\n----- EThree.changePassword -----');
    await this.changePasswords();
    this.log('\n----- EThree.restorePrivateKey -----');
    await this.restorePrivateKeys();
    this.log('\n----- EThree.resetPrivateKeyBackup -----');
    await this.resetPrivateKeyBackups();

    this.log('\n* Testing additional methods:');

    this.log('\n----- EThree.rotatePrivateKey -----');
    await this.rotatePrivateKeys();
    this.log('\n----- EThree.cleanup -----');
    await this.cleanup();
    this.log('\n----- EThree.unregister -----');
    await this.unregisterUsers();
  }

  render() {
    return (
      <ScrollView>
        <Text>{this.state.logs}</Text>
      </ScrollView>
    );
  }

  log(e) {
    this.setState({logs: `${this.state.logs}\n${e}`});
  }

  async initializeUsers() {
    const {alice, bob} = this;

    await alice.initialize();
    await bob.initialize();
  }

  async registerUsers() {
    const {alice, bob} = this;

    await alice.register();
    await bob.register();
  }

  async findUsers() {
    const {alice, bob} = this;

    this.bobLookup = await alice.findUsers([bob.identity]);
    this.aliceLookup = await bob.findUsers([alice.identity]);
  }

  async encryptAndDecrypt() {
    const {alice, bob} = this;

    let aliceEncryptedText = await alice.encrypt(
      `Hello ${bob.identity}! How are you??`,
      this.bobLookup,
    );
    await bob.decrypt(aliceEncryptedText, this.aliceLookup[alice.identity]);

    let bobEncryptedText = await bob.encrypt(
      `Hello ${alice.identity}! How are you?`,
      this.aliceLookup,
    );
    await alice.decrypt(bobEncryptedText, this.bobLookup[bob.identity]);
  }

  async backupPrivateKeys() {
    const {alice, bob} = this;

    await alice.backupPrivateKey(`${alice.identity}_pkeypassword`);
    await bob.backupPrivateKey(`${bob.identity}_pkeypassword`);
  }

  async changePasswords() {
    const {alice, bob} = this;

    await alice.changePassword(
      `${alice.identity}_pkeypassword`,
      `${alice.identity}_pkeypassword_new`,
    );
    await bob.changePassword(
      `${bob.identity}_pkeypassword`,
      `${bob.identity}_pkeypassword_new`,
    );
  }

  async restorePrivateKeys() {
    const {alice, bob} = this;

    await alice.restorePrivateKey(`${alice.identity}_pkeypassword_new`);
    await bob.restorePrivateKey(`${bob.identity}_pkeypassword_new`);
  }

  async resetPrivateKeyBackups() {
    const {alice, bob} = this;

    await alice.resetPrivateKeyBackup();
    await bob.resetPrivateKeyBackup();
  }

  async rotatePrivateKeys() {
    const {alice, bob} = this;

    await alice.rotatePrivateKey();
    await bob.rotatePrivateKey();
  }

  async cleanup() {
    const {alice, bob} = this;

    await alice.cleanup();
    await bob.cleanup();
  }

  async unregisterUsers() {
    const {alice, bob} = this;

    await alice.unregister();
    await bob.unregister();
  }
}
