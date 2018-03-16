import { AppPage } from './app.po';

describe('ngPhoneBook App Login Page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display header message', () => {
    page.navigateTo();
    expect(page.getHeader()).toEqual('Phonebook is here!');
  });
});
