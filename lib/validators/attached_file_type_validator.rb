# eq attached_file_type: { pattern: /^\.gltf$/i, type: 'gltf' }

class AttachedFileTypeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return true unless value.attached?
    return true unless options&.dig(:pattern)

    pattern = options[:pattern]
    type = options[:type] || I18n.t('activerecord.errors.messages.specified_format')
    attachments = value.is_a?(ActiveStorage::Attached::Many) ? value.attachments : [value.attachment]
    # any? {|item| ... } -> bool
    # content_type -> "image/jpeg"の形式で返す
    return unless attachments.any? { |attachment| !attachment.content_type.match?(pattern) }
    # extension_with_delimiter -> ファイルの拡張子を返す e.g. ".gltf"
    return unless attachments.any? { |attachment| !attachment.filename.extension_with_delimiter.match?(pattern) }

    record.errors.add attribute, :invalid_file_type, type:
  end
end
