(function(){
    function init() {
    if (window.requestFileSystem) {
        initFileSystem();
    } else {
        alert('filesystem not supported on your browser');
    }
    // I will remove this subsequently to have look like sublime text.
    // CKEDITOR.replace('smartedContentEditor', {
    //     skin: 'moono',
    //     uiColor: '#AADC6E',
    //     language: 'en'
    // });

}

var selectedSkin = document.getElementById('selectedSkin');
var selectedLanguage = document.getElementById('selectedLanguage');
var saveButton = document.getElementById('save');
var newTab = document.getElementById('newTab');
var smEditor = document.getElementById('editor');
var showFiles = document.getElementById('saved-files');
var smEditorId;

selectedSkin.addEventListener('change', changeSkin);
selectedLanguage.addEventListener('change', changeLanguage);
saveButton.addEventListener('click', save);
newTab.addEventListener('click', openNewTab);

function changeSkin() {
    var selectedSkin = document.getElementById('selectedSkin').value;
    smEditorId = document.querySelector('textarea').id;
    CKEDITOR.instances[smEditorId].destroy(true);
    CKEDITOR.replace(smEditorId, {
        skin: selectedSkin
    });
}


function changeLanguage() {
    var selectedLanguage = document.getElementById('selectedLanguage').value;
    smEditorId = document.querySelector('textarea').id;
    CKEDITOR.instances[smEditorId].destroy(true);
    CKEDITOR.replace(smEditorId, {
        language: selectedLanguage
    });
}

var tabElement = document.getElementById('tabDiv');

function openNewTab() {
    var tabName = prompt("Enter new tab name");
    appendNewTab(tabName);
    smEditor.innerHTML = '<textarea name="' + tabName + '" id="' + tabName + '" rows="10" cols="80"></textarea>';
    CKEDITOR.replace(tabName, {
        skin: 'moono',
        uiColor: '#AADC6E',
        language: 'en'
    });
}

function appendNewTab(name) {
    var li = document.createElement('li');
    var link = document.createElement('a');
    var removeLinkSpan = document.createElement('span');
    var removeLinkI = document.createElement('i');
    li.className = name;
    link.innerHTML = name + ".txt";
    link.className = name;
    li.appendChild(link);
    removeLinkI.className = 'fa fa-close';
    removeLinkSpan.appendChild(removeLinkI);
    li.appendChild(removeLinkSpan);
    link.addEventListener('click', function(e) {
        e.preventDefault();
        loadTabData(name);
    });
    removeLinkI.addEventListener('click', function(e) {
        e.preventDefault();
        closeTab(name);
    });

    tabElement.appendChild(li);
}
window.onload = function() {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    var filesystem = null;
    init();
}


function closeTab(tab) {
    alert("close : " + tab);
    var tabLi = document.getElementsByClassName('tab');
    tabElement.removeChild(tabLi);
}

function initFileSystem() {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
        function(grantedSize) {
            window.requestFileSystem(window.PERSISTENT, grantedSize, successCB, errorHandler);

        }, errorHandler);
}

function successCB(fs) {
    filesystem = fs;
    showSavedFiles();
}


function errorHandler(e) {
    console.log('Error: ' + e);
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
    smEditorId = document.querySelector('textarea').id;
    var getData = CKEDITOR.instances[smEditorId].getData();

    filesystem.root.getFile(smEditorId + '.txt', { create: true }, function(fileEntry) {

        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
                showSavedFiles();
            };

            fileWriter.onerror = function(e) {
                console.log('Write error: ' + e.toString());
                alert('An error occurred and your file could not be saved!');
            };

            var contentBlob = new Blob([getData], { type: 'text/html' });

            fileWriter.write(contentBlob);

        }, errorHandler);

    }, errorHandler);
}

function loadTabData(filename) {
    filesystem.root.getFile(filename + ".txt", {}, function(fileEntry) {

        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onload = function(e) {
                smEditor.innerHTML = '<textarea name="' + filename + '" id="' + filename + '" rows="10" cols="80">' + this.result + '</textarea>';
                CKEDITOR.replace(filename, {
                    skin: 'moono',
                    uiColor: '#AADC6E',
                    language: 'en'
                });
            };

            reader.readAsText(file);
        }, errorHandler);

    }, function(error) {
        console.log(error);
        smEditor.innerHTML = '<textarea name="' + filename + '" id="' + filename + '" rows="10" cols="80">' + error.message + '</textarea>';
        CKEDITOR.replace(filename, {
            skin: 'moono',
            uiColor: '#AADC6E',
            language: 'en'
        });
    });
}


function showSavedFiles() {
    var dirReader = filesystem.root.createReader();
    var entries = [];

    var getEntries = function() {
        dirReader.readEntries(function(results) {
            if (!results.length) {
                showEntries(entries.sort().reverse());
            } else {
                entries = entries.concat(results);
                getEntries();
            }
        }, errorHandler);
    };

    getEntries();
}

function showEntries(entries) {
    showFiles.innerHTML = '';
    if(entries.length == 0){
        var p = document.createElement('p');
        p.innerHTML = "No file saved yet!";
        p.className = 'no-file';
        showFiles.appendChild(p);
    }
    entries.forEach(function(entry, i) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        var name = entry.name.split('.')[0];
        link.innerHTML = entry.name;
        link.className = 'edit-file';
        li.appendChild(link);

        showFiles.appendChild(li);
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (!checkIfTabIsOpen(name)) {
                appendNewTab(name);
            }
            loadTabData(name);
        });

    });

}

function checkIfTabIsOpen(tabName) {
    var liLists = document.getElementById('tabDiv').children;
    var notFound = false;
    for (i = 0; i < liLists.length; i++) {
        if (tabName == liLists[i].className) {
            alert('already opened');
            notFound = true
            break
        } else {
            notFound = false;
        }
    }
    return notFound;
}

})();