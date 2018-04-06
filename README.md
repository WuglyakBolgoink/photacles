# Photacles

Private Photo Cloud for Home Server.

## Install

### Before start

Install:

+ [nodeJS][1]
+ [yarn][4]
+ Console image editor: [graphicsmagick][2]
+ Database: [postgresql][3]


## API

base URL: `http://<host|ip>:<port|3000>/api`

+ GET       /images - Return list of images with thumbs
+ GET       /images/refresh - Refresh library manually

+ GET       /images/:id - Get information about images
+ POST      /images/:id - Change information about image
+ DELETE    /images/:id - Remove image
+ POST      /images/:id/move - Move image to another folder => Body: { to: "<new_folder_name>" }

+ GET       /images/filter/?q=<...> - Filter images with some search queries, like "get all images with label 'me'"

+ POST      /images/import - Import Images from external folder => Body: { from: "<folder_name>", to: "<folder_name_in_library>", filter: [<ignored_image_extensions_or_something_else>]}


[1]: https://nodejs.org
[2]: http://www.graphicsmagick.org
[3]: https://www.postgresql.org
[4]: https://yarnpkg.com



