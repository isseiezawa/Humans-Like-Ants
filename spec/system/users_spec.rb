require 'rails_helper'

RSpec.describe User, type: :system do
  let(:user) { create(:user) }

  describe 'User CRUD' do
    describe 'ログイン前' do
      describe 'ユーザー新規作成' do
        before { visit new_user_path }

        context 'フォームの入力値が正常' do
          it 'ユーザーの新規作成が成功すること' do
            fill_in '名前', with: 'name'
            fill_in 'メールアドレス', with: 'new-user-test@example.com'
            fill_in 'パスワード', with: 'password'
            fill_in 'パスワード確認', with: 'password'
            click_on '登録'
            expect(page).to have_content 'ユーザー登録が完了しました'
            expect(current_path).to eq login_path
          end
        end

        context 'name未入力時' do
          it 'ユーザーの新規作成が失敗すること' do
            fill_in '名前', with: nil
            fill_in 'メールアドレス', with: 'new-user-test@example.com'
            fill_in 'パスワード', with: 'password'
            fill_in 'パスワード確認', with: 'password'
            click_on '登録'
            expect(page).to have_content 'ユーザー登録に失敗しました'
            expect(page).to have_content '名前を入力してください'
            expect(current_path).to eq new_user_path
          end
        end

        context 'email未入力時' do
          it 'ユーザーの新規作成が失敗すること' do
            fill_in '名前', with: 'name'
            fill_in 'メールアドレス', with: nil
            fill_in 'パスワード', with: 'password'
            fill_in 'パスワード確認', with: 'password'
            click_on '登録'
            expect(page).to have_content 'ユーザー登録に失敗しました'
            expect(page).to have_content 'メールアドレスを入力してください'
            expect(current_path).to eq new_user_path
          end
        end

        context 'email重複時' do
          it 'ユーザーの新規作成が失敗すること' do
            existed_user = create(:user)
            fill_in '名前', with: 'name'
            fill_in 'メールアドレス', with: existed_user.email
            fill_in 'パスワード', with: 'password'
            fill_in 'パスワード確認', with: 'password'
            click_on '登録'
            expect(page).to have_content 'ユーザー登録に失敗しました'
            expect(page).to have_content 'メールアドレスはすでに存在します'
            expect(current_path).to eq new_user_path
          end
        end

        context 'password未入力時' do
          it 'ユーザーの新規作成が失敗すること' do
            fill_in '名前', with: 'name'
            fill_in 'メールアドレス', with: 'new-user-test@example.com'
            fill_in 'パスワード', with: nil
            fill_in 'パスワード確認', with: 'password'
            click_on '登録'
            expect(page).to have_content 'ユーザー登録に失敗しました'
            expect(page).to have_content 'パスワードは8文字以上で入力してください'
            expect(current_path).to eq new_user_path
          end
        end

        context 'passwordが7文字の場合' do
          it 'ユーザーの新規作成が失敗すること' do
            fill_in '名前', with: 'name'
            fill_in 'メールアドレス', with: 'new-user-test@example.com'
            fill_in 'パスワード', with: 'a' * 7
            fill_in 'パスワード確認', with: 'a' * 7
            click_on '登録'
            expect(page).to have_content 'ユーザー登録に失敗しました'
            expect(page).to have_content 'パスワードは8文字以上で入力してください'
            expect(current_path).to eq new_user_path
          end
        end

        context 'passwordとpassword_confirmationが不一致の場合' do
          it 'ユーザーの新規作成が失敗すること' do
            fill_in '名前', with: 'name'
            fill_in 'メールアドレス', with: 'new-user-test@example.com'
            fill_in 'パスワード', with: 'password'
            fill_in 'パスワード確認', with: 'another-password'
            click_on '登録'
            expect(page).to have_content 'ユーザー登録に失敗しました'
            expect(page).to have_content 'パスワード確認とパスワードの入力が一致しません'
            expect(current_path).to eq new_user_path
          end
        end
      end

      describe 'ユーザー詳細画面' do
        context 'ログインしていない状態' do
          it 'ユーザー詳細画面へのアクセスに失敗する' do
            visit user_path user
            expect(page).to have_content 'ログインしてください'
            expect(current_path).to eq login_path
          end
        end
      end
    end
  end

  describe 'ログイン後' do
    before { login_as(user) }

    context '他のユーザー詳細ページへアクセス' do
      let!(:other_user) { create(:user, email: 'other-user@example.com') }

      it 'アクセスに成功すること' do
        visit user_path other_user
        expect(page).to have_content other_user.name
      end
    end
  end
end
