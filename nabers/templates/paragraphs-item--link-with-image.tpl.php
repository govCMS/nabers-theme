<?php

/**
 * @file
 * paragraphs-item--link-with-image.tpl.php
 *
 * Default theme implementation for entities. Inherited from
 * paragraphs-item.tpl.php.
 */
?>
<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <div class="content"<?php print $content_attributes; ?>>
    <?php if (!empty($wrapper_link['link_url']) && !empty($wrapper_link['link_title'])): ?>
    <a class="wrapper-link" href="<?php echo $wrapper_link['link_url']; ?>" title="<?php echo $wrapper_link['link_title']; ?>">
    <?php endif; ?>
      <?php
      print render($content);
      ?>
    <?php if (!empty($wrapper_link['link_url']) && !empty($wrapper_link['link_title'])): ?>
    </a>
    <?php endif; ?>
  </div>
</div>
