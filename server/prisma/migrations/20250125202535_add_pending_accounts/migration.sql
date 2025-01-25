-- CreateTable
CREATE TABLE "PendingAccount" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "bankConnectionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingAccount_externalId_key" ON "PendingAccount"("externalId");

-- AddForeignKey
ALTER TABLE "PendingAccount" ADD CONSTRAINT "PendingAccount_bankConnectionId_fkey" FOREIGN KEY ("bankConnectionId") REFERENCES "BankConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
