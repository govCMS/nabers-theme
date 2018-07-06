<?php

/**
 * @file
 * Default theme implementation for a single paragraph item.
 *
 * Available variables:
 * - $content: An array of content items. Use render($content) to print them
 *   all, or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. By default the following classes are available, where
 *   the parts enclosed by {} are replaced by the appropriate values:
 *   - entity
 *   - entity-paragraphs-item
 *   - paragraphs-item-{bundle}
 *
 * Other variables:
 * - $classes_array: Array of html class attribute values. It is flattened into
 *   a string within the variable $classes.
 *
 * @see template_preprocess()
 * @see template_preprocess_entity()
 * @see template_process()
 */
?>
<?php hide($content['field_featured_data_gallery']); ?>
<?php hide($content['field_featured_data_label']); ?>
<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php if (!empty($content['items'])): ?>
    <?php foreach ($content['items'] as $item): ?>
      <div class="featured-content"<?php print $content_attributes; ?>>
        <?php if (!empty($item['featured_image'])) : ?>
          <div class="featured-content__image image">
            <?php print render($item['featured_image']); ?>
          </div>
        <?php endif; ?>
        <div class="featured-content__text">
          <?php if (!empty($item['featured_subtitle'])): ?>
            <div class="featured-content__subtitle">
              <?php print render($item['featured_subtitle']); ?>
              <?php if(!empty($item['data_category'])):?>
               <span class="subtitle-divider">/</span>
                <span class="subtitle-data-category"><?php echo $item['data_category']; ?></span>
              <?php endif; ?>
            </div>
          <?php endif; ?>
          <?php if (!empty($item['featured_title'])): ?>
            <div class="featured-content__title"><?php print render($item['featured_title']); ?></div>
          <?php endif; ?>
          <?php if (!empty($item['body'])): ?>
            <div class="featured-content__body"><?php print render($item['body']); ?></div>
          <?php endif; ?>
          <?php if (!empty($item['link_to'])) : ?>
            <div class="featured-content__call_to_action">
              <?php print render($item['link_to']); ?>
            </div>
          <?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
</div>
