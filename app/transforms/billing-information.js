import DS from 'ember-data';
import countryList from 'iso-3166-country-list';

export default DS.Transform.extend({
  deserialize(serialized) {
    console.log(serialized)
    if (serialized) {

      return {
        city: serialized.city ? serialized.city : "",
        state: serialized.state,
        postCode: serialized.postCode,
        department: serialized.department,
        address: serialized.address,
        organization: serialized.organization,
        country: serialized.country ? {code: serialized.country, name: countryList.name(serialized.country)} : ""
      };
    } else {
      return null;
    }
  },

  serialize(deserialized) {
    if (deserialized) {
      console.log("dhdhdhdhd")
      console.log(deserialized)
      return  {
        city: deserialized.city,
        state: deserialized.state,
        address: deserialized.address,
        postCode: deserialized.postCode,
        department: deserialized.department,
        organization: deserialized.organization,
        country: deserialized.country.code
      };
    } else {
      return null;
    }
  }
});
