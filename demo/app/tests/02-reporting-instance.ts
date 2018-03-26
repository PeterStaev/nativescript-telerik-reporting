import { ReportingClient } from "nativescript-telerik-reporting";
import { DocumentFormat } from "nativescript-telerik-reporting/reporting/document";
import { ReportingInstance } from "nativescript-telerik-reporting/reporting/instance";

import { reportSource, serverUrl } from "./shared-config";

mocha.setup({
    timeout: 110000,
});

describe("ReportingInstance", () => {
    let client: ReportingClient;
    let instance: ReportingInstance;
    
    before((done) => {
        client = new ReportingClient({ serverUrl });
        client.register()
            .then(() => client.createInstance(reportSource))
            .then((value) => {
                instance = value;
                done();
            })
            .catch(done);
    });
    
    it("Should create a document", (done) => {
        instance.createDocument({ format: DocumentFormat.Pdf }).then((doc) => {
            try {
                assert.strictEqual(doc.instance.instanceId, instance.instanceId);
                assert.isNotEmpty(doc.documentId);
                done();
            }
            catch (e) {
                done(e);
            }    
        }, done);
    });
    
    it("Should destroy", (done) => {
        instance.destroy().then(done, done);
    });
    
    after((done) => {
        client.unregister().then(done, done);
    });
});