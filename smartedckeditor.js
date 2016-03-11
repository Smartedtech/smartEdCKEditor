function init() {
    CKEDITOR.replace('smartedContentEditor', {
        skin: 'moono',
        uiColor: '#AADC6E',
        language: 'en'
    });

}

function changeSkin() {
    var selectedSkin = document.getElementById('selectedSkin').value;
    CKEDITOR.instances.smartedContentEditor.destroy(true);
    CKEDITOR.replace('smartedContentEditor', {
        skin: selectedSkin
    });
}

function changeLanguage() {
    var selectedLanguage = document.getElementById('selectedLanguage').value;
    CKEDITOR.instances.smartedContentEditor.destroy(true);
    CKEDITOR.replace('smartedContentEditor', {
        language: selectedLanguage
    });
}

function openNewTab() {
    alert('open new tab');
}

function save() {

    var getData = CKEDITOR.instances.smartedContentEditor.getData(function(evt) {

    });

    alert(getData);

}
