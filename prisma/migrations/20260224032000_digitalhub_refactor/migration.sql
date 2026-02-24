-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAID', 'DELIVERED', 'FAILED', 'REFUNDED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Account_provider_providerAccountId_key";

-- DropIndex
DROP INDEX "Order_buyerId_idx";

-- DropIndex
DROP INDEX "Order_listingId_idx";

-- DropIndex
DROP INDEX "Order_sellerId_idx";

-- DropIndex
DROP INDEX "Order_stripePaymentIntentId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "access_token",
DROP COLUMN "expires_at",
DROP COLUMN "id_token",
DROP COLUMN "provider",
DROP COLUMN "providerAccountId",
DROP COLUMN "refresh_token",
DROP COLUMN "scope",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "extraInfo" TEXT,
ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "soldAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "buyerId",
DROP COLUMN "commission",
DROP COLUMN "credentials",
DROP COLUMN "escrowReleaseAt",
DROP COLUMN "listingId",
DROP COLUMN "payoutAmount",
DROP COLUMN "sellerId",
DROP COLUMN "stripeCheckoutId",
DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "buyerEmail" TEXT NOT NULL,
ADD COLUMN     "buyerName" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "productId" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "Listing";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SellerTier";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "duration" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_isActive_idx" ON "Product"("category", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_orderId_key" ON "Account"("orderId");

-- CreateIndex
CREATE INDEX "Account_productId_isSold_idx" ON "Account"("productId", "isSold");

-- CreateIndex
CREATE UNIQUE INDEX "Order_accountId_key" ON "Order"("accountId");

-- CreateIndex
CREATE INDEX "Order_productId_idx" ON "Order"("productId");

-- CreateIndex
CREATE INDEX "Order_buyerEmail_idx" ON "Order"("buyerEmail");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

