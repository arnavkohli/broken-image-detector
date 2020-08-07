const expect = require('chai').expect;
const axios = require('axios');


describe('broken link test', function() {
    it('should check the page for broken image links', async () => {
        
        // Waiting for browser to load page
        await browser.url("https://www.americanexpress.com/us")
        browser.debug();

        // Exracting all <img> elements
        const links = await $$('<img>');
        // Extracting src of all <img> elements
        const urls = links.map(link => link.getAttribute('src'));
        var filtered_urls;

        // Waiting to receive all <img> src URLs
        await Promise.all(urls).then(response => {filtered_urls = response})

        // Filtering them and removing the garbage ones
        filtered_urls = filtered_urls.filter(function(u) {
            if (u === null)
                return false;
            return u.startsWith("https");
        });

        // Sending a request to all URLs
        const requests = filtered_urls.map(url => axios.get(url));

        //  Waiting to receive all responses back
        const responses = await Promise.all(requests);

        // Checking status codes for all responses
        const statusCodes = responses.map(response => response.status);

        var errored = [];
        // All status codes should be 200
        for (var i = 0; i < statusCodes.length; i++){
            console.log(statusCodes[i], filtered_urls[i])
            if (statusCodes[i] !== 200)
                errored.push(filtered_urls[i])
            expect(statusCodes[i]).to.be.equal(200);
        }

        console.log('[ERRORED_OUT_URLS]', errored);
    });
});