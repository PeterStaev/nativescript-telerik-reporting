**This repo only supports NativeScript pre-6.0. The latest version of the plugin supporting NS 6+ is availble as part of [ProPlugins](https://proplugins.org).**
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
* **constructor(ReportingClientOptions)**  
Creates a reporting client instance with the given `serverUrl`. Note this should be the root of your site where you host the REST service and should **not** include `/api/reports` in it.   
Also you can send `additionalHeaders` which will be sent with every request. Useful for sending authentication in case your reporting service requires authentication. 
* **getAvailableDocumentFormats(): Promise<DocumentFormat[]>**  
Gets an array of supported document export formats by the server. This method can be called without registering the client. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-general-api-get-document-formats))
* **register(): Promise<void>**  
Registers the client with the server. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-api-register-client))
* **unregister(): Promise<void>**  
Unregisters the client from the servers. You need to call this once you finished using the reporting client so it can free up resources on the server. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-api-unregister-client))
* **getReportParameters(ReportSource): Promise<ReportParameter[]>**  
Gets info about the parameters for the given reports. Also can be used to check the validity of the given parameters for the given report. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-report-parameters-api-get-report-parameters))
* **createInstance(ReportSource): Promise<ReportingInstance>**  
Creates a `ReportingInstance` that can be used to render and download reports from the server. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-report-instances-api-create-report-instance))

### `ReportingInstance`
#### Methods
* **createDocument(DocumentFormatKey): Promise<ReportingDocument>**  
Creates a `ReportingDocument` with the given export format. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-documents-api-request-document))
* **destroy(): Promise<void>**  
Destroys the reporting instance from the server. It is important to call this method once you finish your work so it can free the resources on the server. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-report-instances-api-destroy-report-instance))

### `ReportingDocument`
#### Methods
* **getInfo(): Promise<DocumentInfo>**  
Gets info about the rendered report document, for example if it is ready on the server, how many pages it has, etc.([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-documents-api-get-document-info)
* **download(File?): Promise<File>**  
Downloads the prepared document from the server. By default it names the file with `documentId` adds an appropriate extension and saves the file in the device specific temp folder. In case you need to save the file somewhere else, or need to name it differently you can send a `File` instance to this method. 
* **getPage(number): Promise<PageInfo>**  
Gets information about the given page. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-documents-api-get-document-info))
* **destroy(): Promise<void>**  
Destroys the reporting document from the server. It is important to call this method once you finish your work so it can free the resources on the server. ([API Reference](https://docs.telerik.com/reporting/telerik-reporting-rest-documents-api-destroy-document))

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
