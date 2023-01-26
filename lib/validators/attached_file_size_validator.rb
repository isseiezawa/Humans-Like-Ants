# eq attached_file_size: { maximum: 2.kilobytes }

class AttachedFileSizeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return true unless value.attached?
    # validates(種類, オプション引数)のオプション引数部分
    # dig(key, ...) -> object | nil, keyを選択してobjectを得る処理
    return true unless options&.dig(:maximum)

    maximum = options[:maximum]
    attachements = value.is_a?(ActiveStorage::Attached::Many) ? value.attachments : [value.attachment]
    return unless attachements.any? { |attachment| attachment.byte_size >= maximum }

    # less_thanはi18n, countはi18nの引数
    # .to_s(:human_size)はto_sの拡張機能。バイトで表記してくれる
    record.errors.add attribute, :less_than, count: maximum.to_s(:human_size)
  end
end
