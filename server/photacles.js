const pFiles = require('../modules/p-files.js');

module.exports = {
    library: {
        import: (form) => {
            // todo: Import Images from external folder => Body: { from: "<folder_name>", to: "<folder_name_in_library>", filter: [<ignored_image_extensions_or_something_else>]}
        },
        refresh: () => {
            // todo: Refresh library manually
        },
        createFolder: (where, name) => {
        }
    },

    search: (query) => {
        // todo: Filter images with some search queries, like "get all images with label 'me'"
    },

    images: {
        getImages: () => {
            // todo: Return list of images with thumbs...
            return [];
        },
        findById: (id) => {
            // todo: Get information about images
        },
        changeDetails: (id, form) => {
            // todo: Change information about image
        },
        remove: (id) => {
            // todo: Remove image
        },
        move: (id, form) => {
            // todo: Move image to another folder => Body: { to: "<new_folder_name>" }
        }
    }
};
