<?php
session_start();

if (!isset($_SESSION['user_name'])) {
    // not logged in → redirect to login
    header("Location: /login");
    exit();
}

if(!isset($_SESSION['last_story'])) {
    $this->render('home', ['message' => 'You have to choose a story first!']);
    header("Location: /home");
    exit();
}
?>
<!DOCTYPE html>
<head>
    <script>
        (function() {
            if (localStorage.getItem("navPanelCollapsed") === "true") {
                document.documentElement.classList.add("nav-collapsed");
            }
        })();
    </script>
    <link rel="stylesheet" type="text/css" href="public/css/style.css">
    <link rel="stylesheet" type="text/css" href="public/css/sketches.css">
    <link rel="stylesheet" type="text/css" href="public/css/nav-panel.css">
    <link rel="stylesheet" type="text/css" href="public/css/popup.css">
    <link rel="stylesheet" type="text/css" href="public/css/multi-select.css">
    <title>Sketches</title>
</head>
<body>
    <nav class="nav-panel">
        <a href="home"><div id="home"></div></a>
        <a href="overview"><div id="overview"></div></a>
        <a><div id="arrow"></div></a>
        <a href="sketches"><div id="sketch"></div></a>
        <a href="note"><div id="note"></div></a>
    </nav>
    <main>
        <header>
            <div class="left-up">
                <?php echo $_SESSION['last_story']->getName(); ?>
            </div>
            <div class="left-down">
                <form id="tags-form">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                    <div class="multiselect">
                        <div class="selectBox">
                            <select>
                                <option>Select the tags</option>
                            </select>
                            <div class="overSelect"></div>
                        </div>
                        <div class="checkboxes">
                            <?php foreach ($tags as $tag): ?>
                                <label>
                                    <input type="checkbox" value="<?= $tag->getId(); ?>"/><?= $tag->getName(); ?>
                                </label>
                            <? endforeach; ?>
                        </div>
                    </div>
                    <input type="submit">
                </form>
                <div class="add-button" data-open-modal="sketch-pop-upWindow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/></svg>
                    Add a new sketch
                </div>
            </div>
            <div class="right-full">
                <div class="log-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M470.5 463.6C451.4 416.9 405.5 384 352 384L288 384C234.5 384 188.6 416.9 169.5 463.6C133.9 426.3 112 375.7 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320C528 375.7 506.1 426.2 470.5 463.6zM430.4 496.3C398.4 516.4 360.6 528 320 528C279.4 528 241.6 516.4 209.5 496.3C216.8 459.6 249.2 432 288 432L352 432C390.8 432 423.2 459.6 430.5 496.3zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 304C297.9 304 280 286.1 280 264C280 241.9 297.9 224 320 224C342.1 224 360 241.9 360 264C360 286.1 342.1 304 320 304zM232 264C232 312.6 271.4 352 320 352C368.6 352 408 312.6 408 264C408 215.4 368.6 176 320 176C271.4 176 232 215.4 232 264z"/></svg>
                    <a id="user-name"><?php echo $_SESSION['user_name'] ?></a>
                </div>
                <form action="logout" method="post">
                    <button class="logout" >Log out</button>
                </form>
            </div>
        </header>
        <section class="sketches">
            <?php foreach($sketches as $sketch): ?>
                <div class="sketch" data-open-modal="sketch-edit-pop-upWindow" data-sketch-id="<?= $sketch->getId() ?>">
                    <div class="img-space">
                        <img src="public/uploads/<?= $sketch->getImage() ?>" alt="sketches">
                    </div>
                    <div class="sketch-info">
                        <h2><?= $sketch->getName() ?></h2>
                        <p><?= $sketch->getDescription() ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </section>
    </main>
    <div id="sketch-pop-upWindow" class="window">
        <div class="window-content">
            <span class="close-button">X</span>
            <a>Add a new sketch</a>
            <form id="window-form" action="addSketch" method="POST" enctype="multipart/form-data">
                <label>
                    Name:
                    <input name="sketch-name" type="text" placeholder="Sketch name" required/>
                </label>
                <label>
                    Description:
                    <textarea name="sketch-description" placeholder="Description" required></textarea>
                </label>
                <div class="multiselect">
                    <label>
                        Choose tags:
                    </label>
                    <div class="selectBox">
                        <label>
                            <select name="sketch-tag" id="sketch-tag" required>
                                <option>Select the tags</option>
                            </select>
                        </label>
                        <div class="overSelect"></div>
                    </div>
                    <div class="checkboxes">
                        <?php foreach ($tags as $tag): ?>
                            <label>
                                <input type="checkbox" value="<?= $tag->getId(); ?>"/><?= $tag->getName(); ?>
                            </label>
                        <? endforeach; ?>
                    </div>
                </div>
                <label>
                    Choose one parent:
                    <select name="sketch-parent" id="sketch-parent" required>
                        <option value="1">root</option>
                    </select>
                </label>
                <label>
                    <input type="file" name="file">
                </label>
                <div class="window-add-button">
                    <button type="submit">Add sketch</button>
                </div>
            </form>
        </div>
    </div>
    <div id="sketch-edit-pop-upWindow" class="window">
        <div class="window-content">
            <span class="close-button">X</span>
            <a>Manage your sketch</a>
            <div class="pop-upManager">
                <div class="removeObject">
                    <form id="window-form" action="removeSketch" method="POST">
                        <label>
                            Retype name of sketch to accept:
                            <input name="sketch-name" type="text" placeholder="Sketch name" required/>
                            <input type="hidden" name="sketchId" value="">
                        </label>
                        <div class="window-add-button">
                            <button type="submit">Remove sketch</button>
                        </div>
                    </form>
                </div>
                <div class="changeObject">
                    <form id="window-form" action="changeSketch" method="POST">
                        <label>
                            Change name:
                            <input name="sketch-name" type="text" placeholder="Sketch name" required/>
                            <input type="hidden" name="sketchId" value="">
                        </label>
                        <label>
                            Change description:
                            <textarea name="sketch-description" placeholder="Description" required></textarea>
                        </label>
                        <div class="multiselect">
                            <label>
                                Change tags:
                            </label>
                            <div class="selectBox">
                                <label>
                                    <select name="sketch-tag" id="sketch-tag" required>
                                        <option>Select the tags</option>
                                    </select>
                                </label>
                                <div class="overSelect"></div>
                            </div>
                            <div class="checkboxes">
                                <?php foreach ($tags as $tag): ?>
                                    <label>
                                        <input type="checkbox" value="<?= $tag->getId(); ?>"/><?= $tag->getName(); ?>
                                    </label>
                                <? endforeach; ?>
                            </div>
                        </div>
                        <label>
                            Choose one parent:
                            <select name="sketch-parent" id="sketch-parent" required>
                                <option value="1">root</option>
                            </select>
                        </label>
                        <label>
                            <input type="file" name="file">
                        </label>
                        <div class="window-add-button">
                            <button type="submit">Update sketch</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
<script src="public/js/popup.js"></script>
<script src="public/js/passOverVars.js"></script>
<script src="public/js/multi-select.js"></script>
<script src="public/js/nav-panel.js"></script>
</body>