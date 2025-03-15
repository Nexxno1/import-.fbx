/// @name FBX Importer
/// @id fbx_importer
/// @description Импорт .fbx файлов в Blockbench
/// @author nexx
/// @version 1.0.0

Plugin.register('fbx_importer', {
    title: 'FBX Importer',
    icon: 'import_export',
    author: 'nexx',
    description: 'Позволяет загружать файлы .fbx в Blockbench.',
    version: '1.0.0',
    variant: 'desktop',
    onload() {
        let action = new Action('import_fbx', {
            name: 'Импортировать FBX',
            icon: 'file_upload',
            category: 'file',
            click() {
                Blockbench.import({
                    extensions: ['fbx'],
                    type: 'FBX Model',
                    readtype: 'arraybuffer',
                }, function (files) {
                    if (!files || files.length === 0) return;
                    
                    let file = files[0];
                    let loader = new THREE.FBXLoader();

                    loader.load(URL.createObjectURL(new Blob([file.content])), (object) => {
                        let model = new Group({name: file.name.replace('.fbx', '')}).addTo();
                        object.traverse((child) => {
                            if (child.isMesh) {
                                let cube = new Cube({
                                    name: child.name,
                                    from: [0, 0, 0],
                                    to: [1, 1, 1],
                                    parent: model
                                });
                            }
                        });
                        Undo.finishEdit('Импорт FBX');
                    });
                });
            }
        });

        MenuBar.addAction(action, 'file.import');
    },
    onunload() {
        MenuBar.removeAction('import_fbx');
    }
});