import { knownFolders } from "file-system";

import { ReportingClient } from "nativescript-telerik-reporting";
import { DocumentFormat, ReportingDocument } from "nativescript-telerik-reporting/reporting/document";
import { ReportingInstance } from "nativescript-telerik-reporting/reporting/instance";

import { reportSource, serverUrl } from "./shared-config";

mocha.setup({
    timeout: 110000,
});

describe("ReportingDocument", () => {
    let client: ReportingClient;
    let instance: ReportingInstance;
    let document: ReportingDocument;
    
    before((done) => {
        client = new ReportingClient({ serverUrl });
        client.register().then(() => {
            client.createInstance(reportSource).then((value) => {
                instance = value;
                instance.createDocument({ format: DocumentFormat.Html5 }).then((doc) => {
                    document = doc;
                    done();
                }, done);
            }, done);
        }, done);
    });
    
    it("Should download using default path", (done) => {
        document.download().then((file) => {
            try {
                assert.isNotNull(file);
                assert.isNotEmpty(file.path);
                assert.strictEqual(file.extension, ".html5");
                assert.isNotEmpty(file.readTextSync(done));
                done();
            }
            catch (e) {
                done(e);
            }
        }, done);
    });
        
    it("Should download using supplied file", (done) => {
        const myFile = knownFolders.documents().getFile("my-document.tmp");
        document.download(myFile).then((file) => {
            try {
                assert.isNotNull(file);
                assert.strictEqual(myFile.path, file.path);
                assert.strictEqual(file.extension, ".tmp");
                assert.isNotEmpty(file.readTextSync(done));
                done();
            }
            catch (e) {
                done(e);
            }
        }, done);
    });
        
    it("Should get page", (done) => {
        const pageNumber = 1;
        document.getPage(pageNumber).then((pageInfo) => {
            try {
                assert.strictEqual(pageInfo.pageNumber, pageNumber);
                assert.strictEqual(pageInfo.pageReady, true);
                assert.isNotEmpty(pageInfo.pageContent);
                done();
            }
            catch (e) {
                done(e);
            }    
        }, done);
    });

    it("Should destroy", (done) => {
        document.destroy().then(done, done);
    });
    
    after((done) => {
        instance.destroy()
            .then(() => client.unregister())
            .then(done)
            .catch(done);
    });
});