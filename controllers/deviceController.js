const { Device, DeviceInfo } = require("../models/models");
const path = require("path");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const { Op } = require("sequelize");

class deviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, "..", "static", fileName));
            const device = await Device.create({ name, price, brandId, typeId, img: fileName });

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    });
                });
            }

            return res.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async get(req, res) {
        let { brandId, typeId, limit, page, minPrice, maxPrice } = req.query;
        page = page || 1;
        limit = limit || 10;
        const offset = limit * page - limit;
        let devices;
        const whereClause = {};

        if (brandId) {
            whereClause.brandId = {
                [Op.in]: brandId.split(",").map(id => parseInt(id, 10))
            };
        }

        if (typeId) {
            whereClause.typeId = parseInt(typeId, 10);
        }

        if (minPrice && maxPrice) {
            whereClause.price = {
                [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
            };
        } else if (minPrice) {
            whereClause.price = {
                [Op.gte]: parseFloat(minPrice)
            };
        } else if (maxPrice) {
            whereClause.price = {
                [Op.lte]: parseFloat(maxPrice)
            };
        }

        devices = await Device.findAndCountAll({
            where: whereClause,
            limit,
            offset
        });

        return res.json({ count: devices.count, devices: devices.rows });
    }

    async getById(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [{
                model: DeviceInfo,
                as: 'info'
            }]
        });
        return res.json(device);
    }
}

module.exports = new deviceController();
