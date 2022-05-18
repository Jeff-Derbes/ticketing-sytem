const express = require("express");
const router = express.Router();
const {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTickets).post(protect, createTicket);

router
  .route("/:id")
  .get(protect, getTicket)
  .delete(protect, deleteTicket)
  .put(protect, updateTicket);

module.exports = router;
