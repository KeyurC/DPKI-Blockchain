//RUN COMMAND: mocha clientSeleniumTest.js --timeout 10000
const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const driver = new Builder().forBrowser('chrome').build();

/**
 * The function tests how the client will operate the client website in order to produce a valid certificate based
 * on their CSR.
 * The CSR uses attributes which will pass the Registration Authorities checks.
 */
describe('ClientSubmitCSRWithCorrectDomain', () => {
    it('Test should make browser go to client page and submit a CSR entry and return a certificate', async () => {
        await driver.get('http://localhost:3000/');
        await driver.findElement(By.id('common_name')).sendKeys('https://keyurc.github.io');
        await driver.findElement(By.id('country')).sendKeys('UK');
        await driver.findElement(By.id('state')).sendKeys('Middlesex');
        await driver.findElement(By.id('locality')).sendKeys('isleworth');
        await driver.findElement(By.id('organization')).sendKeys('DPKI');
        await driver.findElement(By.id('department')).sendKeys('Test');
        await driver.findElement(By.id('CSRSubmit')).click();
        await driver.sleep(1000);
        await driver.findElement(By.id('submissionbtn')).click();
        await driver.sleep(4000);
        let result = await driver.findElement(By.id('certificate_area')).getText();
        expect(result).to.include('BEGIN CERTIFICATE');

    });
});

/**
 * The function tests how the client will operate the client website in order to produce a valid certificate based
 * on their CSR.
 * The CSR uses attributes which will not pass the Registration Authorities checks so should not return a certificate.
 */
describe('ClientSubmitCSRWithIncorrectDomain', () => {
    it('Test should make browser go to client page and submit a CSR entry and return a certificate', async () => {
        await driver.get('http://localhost:3000/');
        await driver.findElement(By.id('common_name')).sendKeys('https://notgonnawork.com');
        await driver.findElement(By.id('country')).sendKeys('C');
        await driver.findElement(By.id('state')).sendKeys('ST');
        await driver.findElement(By.id('locality')).sendKeys('L');
        await driver.findElement(By.id('organization')).sendKeys('Test');
        await driver.findElement(By.id('department')).sendKeys('Test');
        await driver.findElement(By.id('CSRSubmit')).click();
        await driver.sleep(1000);
        await driver.findElement(By.id('submissionbtn')).click();
        await driver.sleep(4000);
        let result = await driver.findElement(By.id('certificate_area')).getText();
        expect(result).to.include('Failed verification');

    });
});

/**
 * The function tests how the client will operate the client website in order to search for certifcates.
 * The test uses an existing domain in order to get a valid certificate.
 */
describe('SearchCertificateTest', () => {
    it('Test should make browser go to client page and search for a certificate and return the correct one', async () => {
        await driver.get('http://localhost:3000/search');
        await driver.findElement(By.id('commonname')).sendKeys('https://keyurc.github.io');
        await driver.findElement(By.id('submitbtn')).click();
        await driver.sleep(1000);
        let result = await driver.findElement(By.id('certificate_area')).getText();
        expect(result).to.include('BEGIN CERTIFICATE');

    });

    after(async () => driver.quit());
});