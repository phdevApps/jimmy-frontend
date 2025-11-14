<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php

    if (!WC()) {
        echo 'cart is initialized';
    } else {
        echo 'cart is not initialized';
    }
    $cart = WC()->cart;
    $cartList = $cart->get_cart();
    echo $cartList->get_total();
    ?>
</body>

</html>