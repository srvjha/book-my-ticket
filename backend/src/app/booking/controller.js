import ApiResponse from "../../utils/api-response.js";
import ApiError from "../../utils/api-error.js";
import bookingService from "./services.js"

class BookingController{
    async seats(req, res){
        const data = await bookingService.getAllSeats(req,res);
        ApiResponse.ok({res,message:"Seats data fetched successfully",data})
    }

    async shows(req, res) {
        const data = await bookingService.getAllShows();
        ApiResponse.ok({res, message: "Shows data fetched successfully", data});
    }

    async showDetails(req, res) {
        const { id } = req.params;
        const data = await bookingService.getShowById(id);
        if(!data){
            throw ApiError.notFound("Show not found");
        }
        ApiResponse.ok({res, message: "Show details fetched successfully", data});
    }

    // async bookSeat(req, res) {
    //     const { id, name } = req.params;
    //     const data = await bookingService.bookSeat(id,name);
    //     ApiResponse.ok({res,message:"Seat booked successfully",data})
    // }

    async bookSeats(req, res) {
        const { seatIds, username } = req.body;
        const data = await bookingService.bookSeats(seatIds, username);
        ApiResponse.ok({res,message:"Seats booked successfully",data})
    }
}

export default BookingController;