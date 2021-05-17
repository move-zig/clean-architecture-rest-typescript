import faker from 'faker';

import { Poster } from './poster';

describe('poster entity', () => {

  describe('name propery', () => {

    it('should return the correct value', () => {
      const name = faker.name.firstName() + ' ' + faker.name.lastName;
      const poster = new Poster({
        name,
        disabled: faker.datatype.boolean(),
        signUpDate: faker.date.past(),
      });
      expect(poster.name).toBe(name);
    });
  });

  describe('disabled propery', () => {

    [ true, false ].forEach(disabled => {
      describe(`when disabled is ${disabled ? 'true' : 'false'}`, () => {

        it('should return the correct value', () => {
          const poster = new Poster({
            name: faker.name.firstName() + ' ' + faker.name.lastName,
            disabled,
            signUpDate: faker.date.past(),
          });
          expect(poster.disabled).toBe(disabled);
        });
      });
    });
  });

  describe('signUpDate propery', () => {

    it('should return the correct value', () => {
      const signUpDate = faker.date.past();
      const poster = new Poster({
        name: faker.name.firstName() + ' ' + faker.name.lastName,
        disabled: faker.datatype.boolean(),
        signUpDate,
      });
      expect(poster.signUpDate).toBe(signUpDate);
    });
  });

  describe('canPost method', () => {

    describe('when the signUpDate is past the cutoff (old enough)', () => {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      it('should return false when disabled is true', () => {
        const poster = new Poster({
          name: faker.name.firstName() + ' ' + faker.name.lastName,
          disabled: true,
          signUpDate: twoYearsAgo,
        });
        expect(poster.canPost()).toBe(false);
      });

      it('should return true when disabled is false', () => {
        const poster = new Poster({
          name: faker.name.firstName() + ' ' + faker.name.lastName,
          disabled: false,
          signUpDate: twoYearsAgo,
        });
        expect(poster.canPost()).toBe(true);
      });
    });

    describe('when the signUpDate is before the cutoff (too recent)', () => {
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

      it('should return false when disabled is true', () => {
        const poster = new Poster({
          name: faker.name.firstName() + ' ' + faker.name.lastName,
          disabled: true,
          signUpDate: twoHoursAgo,
        });
        expect(poster.canPost()).toBe(false);
      });

      it('should return false when disabled is false', () => {
        const poster = new Poster({
          name: faker.name.firstName() + ' ' + faker.name.lastName,
          disabled: false,
          signUpDate: twoHoursAgo,
        });
        expect(poster.canPost()).toBe(false);
      });
    });
  });
});
