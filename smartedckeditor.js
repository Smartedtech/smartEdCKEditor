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
window.onload = function() {
    init();
}

CKEDITOR.plugins.registered['save'] = {
    init: function(editor) {
        var command = editor.addCommand('save', {
            exec: function(editor) {
                save();
            }
        });
        editor.ui.addButton('Save', { label: 'Save', command: 'save' });
    }
}

function save() {

    var getData = CKEDITOR.instances.smartedContentEditor.getData();
    alert(getData);

}
