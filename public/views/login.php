<!DOCTYPE html>
<head>
    <link rel="stylesheet" type="text/css" href="public/css/style.css">
    <link rel="stylesheet" type="text/css" href="public/css/login-style.css">
    <link rel="stylesheet" type="text/css" href="public/css/popup.css">
    <title>Login Page</title>
</head>
<body>
    <div class="login-container">
        <div class="logo-area">
            <div id="storyforge"></div>
        </div>
        <div id="login-message">
            <?php
                if(isset($message)) {
                    echo $message;
                }
            ?>
        </div>
        <form id="login-form" action="login" method="post">
            <div class="user-div">
                E-mail:
                <input name="email" type="text" placeholder="bobr@gmail.com">
            </div>
            <div class="pass-div">
                Password:
                <input name="password" type="password" placeholder="password">
            </div>
            <div class="log-in">
                <button type="submit">Sign in</button>
            </div>
        </form>
        <div data-open-modal="create-acc-pop-upWindow" class="add-button">
            Create an account
        </div>
    </div>
    <div id="create-acc-pop-upWindow" class="window">
        <div class="window-content">
            <span class="close-button">X</span>
            <a>Add a new tag</a>
            <form id="window-form" action="addAccount" method="POST">
                <label>
                    E-mail:
                    <input type="text" name="acc-mail" placeholder="john@pork.com" required/>
                </label>
                <label>
                    Username:
                    <input type="text" name="acc-username" placeholder="Username" required/>
                </label>
                <label>
                    Password:
                    <input type="password" name="acc-pass" placeholder="Secret password" required>
                </label>
                <label>
                    Repeat password:
                    <input type="password" name="acc-repeat-pass" placeholder="Repeat secret password" required>
                </label>
                <div class="window-add-button">
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    </div>
<script src="public/js/popup.js"></script>
</body>