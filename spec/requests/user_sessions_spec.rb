require 'rails_helper'

RSpec.describe 'UserSessions', type: :request do
  let(:user) { create(:user) }

  describe 'GET /new' do
    it 'リクエストが成功すること' do
      get login_url
      expect(response.status).to eq 200
    end
  end

  describe 'GET /create' do
    context 'パラメータが正常な場合' do
      it 'リクエストが成功すること' do
        post login_url, params: { email: user.email, password: 'password' }
        expect(response.status).to eq 302
      end

      it 'リダイレクトされること' do
        post login_url, params: { email: user.email, password: 'password' }
        expect(response).to redirect_to root_url
      end
    end

    context 'パラメータが不正な場合' do
      it 'リクエストが成功すること' do
        post login_url, params: { email: user.email, password: 'another-password' }
        expect(response.status).to eq 422
      end

      it 'エラーが表示されること' do
        post login_url, params: { email: user.email, password: 'another-password' }
        expect(response.body).to include 'ログインに失敗しました'
      end
    end
  end

  describe 'GET /destroy' do
    before do
      login_user(user, 'password', login_path)
    end

    it 'ログアウトに成功すること' do
      delete logout_url user
      expect(response.status).to eq 302
    end

    it 'トップページにリダイレクトすること' do
      delete logout_url user
      expect(response).to redirect_to root_url
    end
  end
end
