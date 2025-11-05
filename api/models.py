from django.db import models

# Create your models here.

class Customer(models.Model):
    company_code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Company Code"
    )
    company_name = models.CharField(
        max_length=255,
        verbose_name="Company Name"
    )
    address = models.TextField(
        blank=True,
        null=True,
        verbose_name="Address"
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Phone Number"
    )
    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name="Email"
    )
    tax_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Tax Number"
    )
    tax_office = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Tax Office"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active Status"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created Date"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated Date"
    )

    class Meta:
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
        ordering = ['company_name']

    def __str__(self):
        return f"{self.company_name} ({self.company_code})"




class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Brand Name")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    is_active = models.BooleanField(default=True, verbose_name="Active Status")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated Date")

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"
        ordering = ['name']

    def __str__(self):
        return self.name