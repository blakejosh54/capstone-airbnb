import Accommodation from "../models/Accommodation.js";

// creates a new accommodation
export async function createAccommodation(req, res) {
  try {
    const data = req.body;

    data.owner = req.user._id;

    if (!data.host && req.user.name) {
      data.host = req.user.name;
    }

    const accommodation = await Accommodation.create(data);

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// gets all accommodations
export async function getAccommodations(req, res) {
  try {
    const accommodations = await Accommodation.find().populate(
      "owner",
      "name email",
    );

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// gets accommodations created by the logged-in user
export async function getMyAccommodations(req, res) {
  try {
    const accommodations = await Accommodation.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// gets one accommodation by ID
export async function getAccommodationById(req, res) {
  try {
    const id = req.params.id;

    const accommodation = await Accommodation.findById(id).populate(
      "owner",
      "name email",
    );

    if (accommodation === null) {
      res.status(404).json({
        message: "Accommodation not found",
      });
      return;
    }

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// updates an accommodation
export async function updateAccommodation(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;

    const accommodation = await Accommodation.findById(id);

    if (accommodation === null) {
      res.status(404).json({
        message: "Accommodation not found",
      });
      return;
    }

    if (accommodation.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "You can only update accommodations you created",
      });
      return;
    }

    delete data.owner;
    delete data.hostId;

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json(updatedAccommodation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// deletes an accommodation
export async function deleteAccommodation(req, res) {
  try {
    const id = req.params.id;

    const accommodation = await Accommodation.findById(id);

    if (accommodation === null) {
      res.status(404).json({
        message: "Accommodation not found",
      });
      return;
    }

    if (accommodation.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "You can only delete accommodations you created",
      });
      return;
    }

    await Accommodation.findByIdAndDelete(id);

    res.status(200).json({
      message: "Accommodation deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
