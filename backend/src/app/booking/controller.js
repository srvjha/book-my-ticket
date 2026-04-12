import ApiResponse from "../../utils/api-response.js";
import bookingService from "./services.js"

class BookingController{
    async seats(req, res){
        const data = await bookingService.getAllSeats(req,res);
        ApiResponse.ok({res,message:"Seats data fetched successfully",data})
    }

    async bookSeat(req, res) {
        const { id, name } = req.params;
        const data = await bookingService.bookSeat(id,name);
        ApiResponse.ok({res,message:"Seat booked successfully",data})
    }
}

export default BookingController;