require 'rails_helper'

RSpec.describe 'Worlds', type: :request do
  describe 'GET /index' do
    it 'リクエストが成功すること' do
      get worlds_url
      expect(response.status).to eq 200
    end
  end
end
