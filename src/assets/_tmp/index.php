<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
    wp_insert_post([
        'post_title' => 'WPForms submission - ',
        'post_content' => "content",
        'post_status' => 'publish',
        'post_type' => 'elementor_form_submission', // CPT used by Elementor
    ]);
    ?>
</body>
</html>