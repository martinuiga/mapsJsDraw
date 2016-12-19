var expect = chai.expect;
var assert = chai.assert;

describe("Map", function () {
  describe("Area", function () {
    it("must exist on the map after importing", function (done) {
      this.timeout(2000);
      testmap1.importGeoJson(geo);
      setTimeout(function () {
        // console.log(JSON.parse(JSON.stringify(geo)));
        // console.log(JSON.parse(JSON.stringify(testmap1._allAreas)));
        // assert.deepEqual(JSON.parse(JSON.stringify(testmap1._allAreas)), JSON.parse(JSON.stringify(geo)));
        assert.deepEqual(testmap1._allAreas, geo);
      }, 2000);
      done();
    });

  });

  // describe("#greets", function() {
  //   it("should throw if no target is passed in", function() {
  //     expect(function() {
  //       (new Cow()).greets();
  //     }).to.throw(Error);
  //   });
  //
  //   it("should greet passed target", function() {
  //     var greetings = (new Cow("Kate")).greets("Baby");
  //     expect(greetings).to.equal("Kate greets Baby");
  //   });
  // });
});