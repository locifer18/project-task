import db from "@/lib/client";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const projectId = formData.get("projectId") as string;
        const type = formData.get("type") as string;
        const title = formData.get("title") as string | null;
        const uploadedBy = formData.get("uploadedBy") as string;
        const userImage = formData.get("userImage") as string;
        const url = formData.get("url") as string | null;

        let uploadResult: any;
        
        if (!projectId || !type) {
            return Response.json(
                { success: false, message: "projectId, type are required" },
                { status: 400 }
            );
        }

        // Check if we have a valid file (not empty) or a valid URL
        const hasFile = file && file.size > 0 && file.name !== "";
        const hasUrl = url && url.trim().length > 0;

        if (!hasFile && !hasUrl) {
            return Response.json(
                { success: false, message: "Either file or url must be provided" },
                { status: 400 }
            );
        }

        if (hasFile) {            
            const allowedTypes = ["image", "zip", "document"];
    
            if (!allowedTypes.includes(type)) {
                return Response.json(
                    { success: false, message: "Invalid type" },
                    { status: 400 }
                );
            }

            // Convert File -> Buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
    
            // Cloudinary Upload
            uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ resource_type: "auto" }, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    })
                    .end(buffer);
            });
        }

        // Save in database
        const asset = await db.asset.create({
            data: {
                projectId,
                type,
                url: hasUrl ? url : uploadResult.secure_url,
                publicId: hasUrl ? `LINK_${Date.now()}` : uploadResult.public_id,
                title: title || (hasFile ? file!.name : "Untitled Link"),
                uploadedBy,
                userImage
            },
        });

        return Response.json({ success: true, asset });
    } catch (err) {
        console.error("Upload error:", err);
        return Response.json(
            { success: false, message: "Upload failed", error: String(err) },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");

        if (!projectId) {
            return Response.json(
                { success: false, message: "projectId is required" },
                { status: 400 }
            );
        }

        const assets = await db.asset.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" }
        });

        return Response.json({ success: true, assets });

    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Failed to fetch assets", error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { assetId } = await req.json();

        if (!assetId) {
            return Response.json(
                { success: false, message: "assetId is required" },
                { status: 400 }
            );
        }

        const asset = await db.asset.findUnique({
            where: { id: assetId }
        });

        if (!asset) {
            return Response.json(
                { success: false, message: "Asset not found" },
                { status: 404 }
            );
        }

        // Only delete from Cloudinary if it's an actual uploaded file (not a link)
        if (!asset.publicId.startsWith("LINK_")) {
            await cloudinary.uploader.destroy(asset.publicId);
        }

        await db.asset.delete({ where: { id: assetId } });

        return Response.json({ success: true, message: "Asset deleted", asset });

    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Failed to delete asset", error },
            { status: 500 }
        );
    }
}