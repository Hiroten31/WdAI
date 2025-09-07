<!DOCTYPE html>
<head>
    <link rel="stylesheet" type="text/css" href="public/css/login-style.css">
    <link rel="stylesheet" type="text/css" href="public/css/style.css">
    <title>Login Page</title>
</head>
<body>
    <div class="login-container">
        <div class="logo-area">
            <div id="storyforge"></div>
        </div>
        <form action="login" method="post">
            <div class="user-div">
                E-mail:
                <input name="email" type="text" placeholder="bobr@gmail.com">
            </div>
            <div class="pass-div">
                Password:
                <input name="password" type="password" placeholder="password">
            </div>
            <div id="login-message">
                <?php
                    if(isset($message)) {
                        echo $message;
                    }
                ?>
            </div>
            <div class="log-in">
                <button type="submit">Sign in</button>
            </div>
        </form>
        <div class="create-acc">
            Create an account
        </div>
    </div>
</body>