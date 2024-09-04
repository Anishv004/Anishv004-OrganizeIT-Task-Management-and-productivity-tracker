const Tags = require('../Model/tagsModel');

exports.addNewTag = async (req, res) => {
    try{
        const tags = await Tags.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tags: tags
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    } 
}

exports.getAllTags = async (req, res) => {
    try{
        const tags = await Tags.find();

        res.status(200).json({
            status: 'success',
            data: {
                tags: tags
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.deleteTag = async (req, res) => {
    try {
        const tags = await Tags.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}