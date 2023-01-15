class AllowedCharactersValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    # self =~ other正規表現otherとのマッチを行う
    unless value =~ /^[a-zA-Z0-9０-９\u3040-\u309f\u30a0-\u30ff\uFF5E\!\！\?\？\+\―\*\(\)\（\）\'\"\&\%\$\s。、ㇰヶㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺャㇻㇼㇽㇾㇿヮ蟻好嬉喜友晴一運営]+$/
      record.errors.add attribute, (options[:message] || :unauthorized_characters)
    end
  end
end
