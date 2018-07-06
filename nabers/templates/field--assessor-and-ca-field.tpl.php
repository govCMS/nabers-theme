<?php

/**
 * @file
 * field--assessor-and-ca-field.tpl.php
 *
 * Default template implementation to display the value of a field. Inherited
 * from field.tpl.php.
 */
?>
<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <?php if (!$label_hidden): ?>
    <div class="field-label"<?php print $title_attributes; ?>><?php print $label ?></div>
  <?php endif; ?>
  <div class="field-items"<?php print $content_attributes; ?>>
    <?php echo $empty_placeholder; ?>
    <?php foreach ($items as $delta => $item): ?>
      <div class="field-item <?php print $delta % 2 ? 'odd' : 'even'; ?>"<?php print $item_attributes[$delta]; ?>><?php print render($item); ?></div>
    <?php endforeach; ?>
  </div>
</div>
