module LoginMacros
  def login_as(user)
    visit root_path
    click_link 'ログイン'
    fill_in 'メールアドレス', with: user.email
    fill_in 'パスワード', with: 'password'
    click_button 'ログイン'
    expect(page).to have_content 'ログインに成功しました' # 処理待ちのために記載
  end
end
