import { ReportingClient } from "nativescript-telerik-reporting";
import { reportSource, serverUrl } from "./shared-config";

mocha.setup({
    timeout: 110000,
});

describe("ReportingClient", () => {
    let client: ReportingClient;
    
    before(() => {
        client = new ReportingClient({ serverUrl });
    });
    
    it("Should get available formats", (done) => {
        client.getAvailableDocumentFormats().then((formats) => {
            assert.isNotEmpty(formats);
            done();
        }, done);
    });
    
    it("Should register", (done) => {
        client.register().then(() => {
            assert.isNotEmpty(client.clientId);
            done();
        }, done);
    });
    
    it("Should create an instance", (done) => {
        client.createInstance(reportSource).then((instance) => {
            try {
                assert.strictEqual(instance.client.clientId, client.clientId);
                assert.isNotEmpty(instance.instanceId);
                done();
            }
            catch (e) {
                done(e);
            }    
        }, done);
    });
        
    it("Should get report params", (done) => {
        client.getReportParameters(reportSource).then((params) => {
            try {
                assert.isNotEmpty(params);
                done();
            }
            catch (e) {
                done(e);
            }    
        }, done);
    });

    it("Should unregister", (done) => {
        client.unregister().then(done, done);
    });
});