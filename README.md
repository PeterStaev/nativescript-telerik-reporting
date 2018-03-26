# NativeScript Telerik Reporting
[![Build Status](https://travis-ci.org/PeterStaev/nativescript-telerik-reporting.svg?branch=master)](https://travis-ci.org/PeterStaev/nativescript-telerik-reporting)
[![npm downloads](https://img.shields.io/npm/dm/nativescript-telerik-reporting.svg)](https://www.npmjs.com/package/nativescript-telerik-reporting)
[![npm downloads](https://img.shields.io/npm/dt/nativescript-telerik-reporting.svg)](https://www.npmjs.com/package/nativescript-telerik-reporting)
[![npm](https://img.shields.io/npm/v/nativescript-telerik-reporting.svg)](https://www.npmjs.com/package/nativescript-telerik-reporting)

A NativeScript plugin for easy access to [Telerik Rporting REST API](https://docs.telerik.com/reporting/telerik-reporting-rest-api).


## Installation
Run the following command from the root of your project:

`tns plugin add nativescript-telerik-reporting`

This command automatically installs the necessary files, as well as stores nativescript-telerik-reporting as a dependency in your project's package.json file.

## Configuration
There is no additional configuration needed!

## API

### `ReportingClient`
#### Methods

### `ReportingInstance`
#### Methods

### `ReportingDocument`
#### Methods

## Usage
A typical usage scenario is when you want to generate a report on your server and the download the file in an appropriate format (for example a PDF document). Below is an example how you can make this. You start by creating a client with your server's URL. Then you register your client, create an instance and a document. Finally you download the document to the mobile device. 

```ts
const req: ReportSource = {
    report: "Telerik.Reporting.Examples.CSharp.Invoice, CSharp.ReportLibrary, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
    parameterValues: {
        OrderNumber: "SO51081",
        ForYear: 2003,
        ForMonth: 7,
    },
};
const reportingClient = new ReportingClient({ serverUrl: "https://....." });
reportingClient.register()
    .then(() => reportingClient.createInstance(req))
    .then((instance) => {
        instance.createDocument({ format: documentFormat } as any).then((document) => {
            document.download().then((file) => {
                utils.ios.openFile(file.path);
                viewModel.set("isBusyIn", false);

                document.destroy()
                    .then(() => instance.destroy())
                    .then(() => reportingClient.unregister);
            });
        });
    });
```
It is really important to remember to call `destroy()` for your instances and documents and to `unregister()` your client as this frees up resources on the server. Also it is a good idea to reuse clients/instances whenever possible. 

## Demos
This repository plain NativeScript demo. In order to run those execute the following in your shell:
```shell
$ git clone https://github.com/peterstaev/nativescript-telerik-reporting
$ cd nativescript-telerik-reporting
$ npm install
$ npm run demo-ios
```
This will run the plain NativeScript demo project on iOS. If you want to run it on Android simply use the `-android` instead of the `-ios` sufix.


## Donate
[![Donate](https://img.shields.io/badge/paypal-donate-brightgreen.svg)](https://bit.ly/2AS9QKB)

`bitcoin:14fjysmpwLvSsAskvLASw6ek5XfhTzskHC`

![Donate](https://www.tangrainc.com/qr.png)
